package mapper

import (
	jellyfin "github.com/sj14/jellyfin-go/api"

	"jellarr/src/internal/model"
)

func ToJFRepos(in []model.PluginRepository) []jellyfin.RepositoryInfo {
	out := make([]jellyfin.RepositoryInfo, 0, len(in))
	for _, r := range in {
		name := jellyfin.NewNullableString(&r.Name)
		url := jellyfin.NewNullableString(&r.URL)
		enabled := r.Enabled
		out = append(out, jellyfin.RepositoryInfo{
			Name:    *name,
			Url:     *url,
			Enabled: &enabled,
		})
	}
	return out
}

func FromJFRepos(in []jellyfin.RepositoryInfo) []model.PluginRepository {
	out := make([]model.PluginRepository, 0, len(in))
	for _, r := range in {
		out = append(out, model.PluginRepository{
			Name:    r.GetName(),
			URL:     r.GetUrl(),
			Enabled: r.GetEnabled(),
		})
	}
	return out
}
