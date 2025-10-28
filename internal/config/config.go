package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Version int       `yaml:"version"`
	BaseUrl string    `yaml:"base_url"`
	System  SystemCfg `yaml:"system"`
}

type SystemCfg struct {
	EnableMetrics bool `yaml:"enableMetrics"`
}

func Load(path string) (*Config, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var c Config
	if err := yaml.Unmarshal(b, &c); err != nil {
		return nil, err
	}
	return &c, nil
}
