package apply

import (
	"context"

	"jellarr/src/internal/api"
	"jellarr/src/internal/config"
)

func ApplyAll(ctx context.Context, jf api.JF, cfg *config.Config) error {
	return ApplySystem(ctx, jf, cfg.System)
}
