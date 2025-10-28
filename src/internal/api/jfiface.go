package api

import (
	"context"

	"jellarr/src/internal/model"
)

type JF interface {
	GetSystem(ctx context.Context) (model.SystemState, error)
	UpdateSystem(ctx context.Context, in model.SystemSpec) error
}

func New(baseURL, apiKey string) JF { return new(baseURL, apiKey) }
