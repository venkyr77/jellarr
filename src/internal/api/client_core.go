package api

import (
	"context"
	"fmt"
	"net/http"

	jellyfin "github.com/sj14/jellyfin-go/api"
)

type configurationAPI interface {
	GetConfiguration(ctx context.Context) jellyfin.ApiGetConfigurationRequest
	GetConfigurationExecute(r jellyfin.ApiGetConfigurationRequest) (*jellyfin.ServerConfiguration, *http.Response, error)
	UpdateConfiguration(ctx context.Context) jellyfin.ApiUpdateConfigurationRequest
	UpdateConfigurationExecute(r jellyfin.ApiUpdateConfigurationRequest) (*http.Response, error)
}

type Client struct {
	Conf configurationAPI
}

func new(baseURL, apiKey string) JF {
	cfg := &jellyfin.Configuration{
		Servers: jellyfin.ServerConfigurations{{URL: baseURL}},
		DefaultHeader: map[string]string{
			"Authorization": fmt.Sprintf(`MediaBrowser Token="%s"`, apiKey),
		},
	}
	ac := jellyfin.NewAPIClient(cfg)
	return &Client{
		Conf: ac.ConfigurationAPI,
	}
}
