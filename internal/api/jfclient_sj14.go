package api

import (
	"context"
	"fmt"

	jellyfin "github.com/sj14/jellyfin-go/api"

	"jellarr/internal/mapper"
	"jellarr/internal/model"
)

type client struct{ c *jellyfin.APIClient }

func new(baseURL, apiKey string) JF {
	cfg := &jellyfin.Configuration{
		Servers: jellyfin.ServerConfigurations{{URL: baseURL}},
		DefaultHeader: map[string]string{
			"Authorization": fmt.Sprintf(`MediaBrowser Token="%s"`, apiKey),
		},
	}
	return &client{c: jellyfin.NewAPIClient(cfg)}
}

func (cl *client) GetSystem(ctx context.Context) (model.SystemState, error) {
	req := cl.c.ConfigurationAPI.GetConfiguration(ctx)
	cfg, _, err := cl.c.ConfigurationAPI.GetConfigurationExecute(req)
	if err != nil {
		return model.SystemState{}, err
	}
	return model.SystemState{
		EnableMetrics:      cfg.GetEnableMetrics(),
		PluginRepositories: mapper.FromJFRepos(cfg.GetPluginRepositories()),
	}, nil
}

func (cl *client) UpdateSystem(ctx context.Context, in model.SystemSpec) error {
	body := jellyfin.ServerConfiguration{
		EnableMetrics:      &in.EnableMetrics,
		PluginRepositories: mapper.ToJFRepos(in.PluginRepositories),
	}
	req := cl.c.ConfigurationAPI.UpdateConfiguration(ctx).ServerConfiguration(body)
	_, err := cl.c.ConfigurationAPI.UpdateConfigurationExecute(req)
	return err
}
