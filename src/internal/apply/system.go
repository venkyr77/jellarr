package apply

import (
	"context"
	"fmt"
	"sort"

	"jellarr/src/internal/api"
	"jellarr/src/internal/model"
)

func ApplySystem(ctx context.Context, jf api.JF, desired model.SystemSpec) error {
	cur, err := jf.GetSystem(ctx)
	if err != nil {
		return fmt.Errorf("get system: %w", err)
	}
	changed := cur.EnableMetrics != desired.EnableMetrics ||
		!EqualReposUnordered(cur.PluginRepositories, desired.PluginRepositories)

	if changed {
		fmt.Println("→ updating system config")
		return jf.UpdateSystem(ctx, desired)
	}
	fmt.Println("✓ system config up to date")
	return nil
}

func EqualReposUnordered(a, b []model.PluginRepository) bool {
	if len(a) != len(b) {
		return false
	}
	ac := append([]model.PluginRepository(nil), a...)
	bc := append([]model.PluginRepository(nil), b...)
	SortRepos(ac)
	SortRepos(bc)
	for i := range ac {
		if ac[i] != bc[i] {
			return false
		}
	}
	return true
}

func SortRepos(r []model.PluginRepository) {
	sort.Slice(r, func(i, j int) bool {
		if r[i].Name != r[j].Name {
			return r[i].Name < r[j].Name
		}
		if r[i].URL != r[j].URL {
			return r[i].URL < r[j].URL
		}
		if r[i].Enabled != r[j].Enabled {
			return r[i].Enabled && !r[j].Enabled
		}
		return false
	})
}
