package api

import (
	"context"
	"fmt"

	jellyfin "github.com/sj14/jellyfin-go/api"
)

type client struct{ c *jellyfin.APIClient }

func new(baseURL, apiKey string) JF {
	cfg := &jellyfin.Configuration{
		Servers: jellyfin.ServerConfigurations{{URL: baseURL}},
		DefaultHeader: map[string]string{
			// per sj14/jellyfin-go README
			"Authorization": fmt.Sprintf(`MediaBrowser Token="%s"`, apiKey),
		},
	}
	return &client{c: jellyfin.NewAPIClient(cfg)}
}

func (cl *client) GetSystem(ctx context.Context) (SystemConfig, error) {
	// Pattern in sj14: <API>.GetX(ctx) -> request; then <API>.GetXExecute(req)
	req := cl.c.ConfigurationAPI.GetConfiguration(ctx)
	cfg, _, err := cl.c.ConfigurationAPI.GetConfigurationExecute(req)
	if err != nil {
		return SystemConfig{}, err
	}
	return SystemConfig{
		EnableMetrics: cfg.GetEnableMetrics(),
	}, nil
}

func (cl *client) UpdateSystem(ctx context.Context, in SystemConfig) error {
	body := jellyfin.ServerConfiguration{
		EnableMetrics: &in.EnableMetrics,
	}
	req := cl.c.ConfigurationAPI.UpdateConfiguration(ctx).
		ServerConfiguration(body)

	_, err := cl.c.ConfigurationAPI.UpdateConfigurationExecute(req)
	return err
}
