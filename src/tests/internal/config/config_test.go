package config_test

import (
	"os"
	"path/filepath"
	"testing"

	. "github.com/onsi/gomega"
	. "github.com/onsi/gomega/gstruct"

	"jellarr/src/internal/config"
)

func TestLoad_HappyPath_Gomega(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	// Act
	cfg, err := config.Load("../../../../sample-config.yml")

	// Assert
	g.Expect(err).NotTo(HaveOccurred())

	g.Expect(*cfg).To(MatchFields(IgnoreExtras, Fields{
		"Version": Equal(1),
		"BaseUrl": Equal("http://10.0.0.78:8096"),
		"System": MatchAllFields(Fields{
			"EnableMetrics": BeTrue(),
			"PluginRepositories": ConsistOf(
				MatchAllFields(Fields{
					"Name":    Equal("Jellyfin Official"),
					"URL":     Equal("https://repo.jellyfin.org/releases/plugin/manifest.json"),
					"Enabled": BeTrue(),
				}),
			),
		}),
	}))
}

func TestLoad_BadYAML(t *testing.T) {
	//Arrange
	g := NewWithT(t)

	tmp := t.TempDir()
	path := filepath.Join(tmp, "bad.yml")

	err := os.WriteFile(path, []byte("system: [1,2"), 0o644)
	g.Expect(err).NotTo(HaveOccurred())

	// Act
	_, err = config.Load(path)

	// Assert
	g.Expect(err).To(HaveOccurred())
}
