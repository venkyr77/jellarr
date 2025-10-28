package apply

import (
	"context"

	"jellarr/internal/api"
	"jellarr/internal/config"
)

func ApplyAll(ctx context.Context, jf api.JF, cfg *config.Config) error {
	return ApplySystem(ctx, jf, cfg.System)
}
