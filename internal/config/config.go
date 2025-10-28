package config

import (
	"os"

	"gopkg.in/yaml.v3"

	"jellarr/internal/model"
)

type Config struct {
	Version int              `yaml:"version"`
	BaseUrl string           `yaml:"base_url"`
	System  model.SystemSpec `yaml:"system"`
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
