package apply

import (
	"context"
	"fmt"

	"jellarr/internal/api"
	"jellarr/internal/config"
)

func ApplySystem(ctx context.Context, jf api.JF, desired config.SystemCfg) error {
	cur, err := jf.GetSystem(ctx)
	if err != nil {
		return fmt.Errorf("get system: %w", err)
	}
	if cur.EnableMetrics != desired.EnableMetrics {
		fmt.Println("→ updating system config")
		return jf.UpdateSystem(ctx, api.SystemConfig{
			EnableMetrics: desired.EnableMetrics,
		})
	}
	fmt.Println("✓ system config up to date")
	return nil
}
