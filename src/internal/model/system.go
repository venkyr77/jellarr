package model

type PluginRepository struct {
	Name    string `yaml:"name"`
	URL     string `yaml:"url"`
	Enabled bool   `yaml:"enabled"`
}

type TrickplayOptions struct {
	EnableHwAcceleration bool `yaml:"enableHwAcceleration"`
}

type SystemSpec struct {
	EnableMetrics      *bool              `yaml:"enableMetrics,omitempty"`
	PluginRepositories []PluginRepository `yaml:"pluginRepositories,omitempty"`
	TrickplayOptions   *TrickplayOptions  `yaml:"trickplayOptions,omitempty"`
}

type SystemState struct {
	EnableMetrics      bool
	PluginRepositories []PluginRepository
	TrickplayOptions   TrickplayOptions
}
