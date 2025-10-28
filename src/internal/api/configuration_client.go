package api

import (
	"context"

	jellyfin "github.com/sj14/jellyfin-go/api"

	"jellarr/src/internal/mapper"
	"jellarr/src/internal/model"
)

func (cl *Client) GetSystem(ctx context.Context) (model.SystemState, error) {
	req := cl.Conf.GetConfiguration(ctx)
	cfg, _, err := cl.Conf.GetConfigurationExecute(req)
	if err != nil {
		return model.SystemState{}, err
	}
	return model.SystemState{
		EnableMetrics:      cfg.GetEnableMetrics(),
		PluginRepositories: mapper.FromJFRepos(cfg.GetPluginRepositories()),
	}, nil
}

func (cl *Client) UpdateSystem(ctx context.Context, in model.SystemSpec) error {
	body := jellyfin.ServerConfiguration{
		EnableMetrics:      &in.EnableMetrics,
		PluginRepositories: mapper.ToJFRepos(in.PluginRepositories),
	}
	req := cl.Conf.UpdateConfiguration(ctx).ServerConfiguration(body)
	_, err := cl.Conf.UpdateConfigurationExecute(req)
	return err
}
