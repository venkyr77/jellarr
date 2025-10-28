package model

type PluginRepository struct {
	Name    string `yaml:"name"`
	URL     string `yaml:"url"`
	Enabled bool   `yaml:"enabled"`
}

type SystemSpec struct {
	EnableMetrics      bool               `yaml:"enableMetrics"`
	PluginRepositories []PluginRepository `yaml:"pluginRepositories,omitempty"`
}

type SystemState struct {
	EnableMetrics      bool
	PluginRepositories []PluginRepository
}
