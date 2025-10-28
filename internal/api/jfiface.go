package api

import "context"

type SystemConfig struct {
	EnableMetrics bool
}

type JF interface {
	GetSystem(ctx context.Context) (SystemConfig, error)
	UpdateSystem(ctx context.Context, in SystemConfig) error
}

func New(baseURL, apiKey string) JF { return new(baseURL, apiKey) }
