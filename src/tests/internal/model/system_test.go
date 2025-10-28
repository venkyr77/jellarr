package model_test

import (
	"os"
	"testing"

	. "github.com/onsi/gomega"
	. "github.com/onsi/gomega/gstruct"

	"gopkg.in/yaml.v3"

	"jellarr/src/internal/model"
)

func TestSystemSpecYAML(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	data, err := os.ReadFile("../../../../sample-config.yml")
	g.Expect(err).NotTo(HaveOccurred())
	var root struct {
		Version int              `yaml:"version"`
		BaseURL string           `yaml:"base_url"`
		System  model.SystemSpec `yaml:"system"`
	}

	// Act
	err = yaml.Unmarshal(data, &root)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(root.System.EnableMetrics).To(BeTrue())
	g.Expect(root.System.PluginRepositories).To(ConsistOf(
		MatchAllFields(Fields{
			"Name":    Equal("Jellyfin Official"),
			"URL":     Equal("https://repo.jellyfin.org/releases/plugin/manifest.json"),
			"Enabled": BeTrue(),
		}),
	))
}
