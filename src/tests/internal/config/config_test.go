package config_test

import (
	"os"
	"path/filepath"
	"testing"

	. "github.com/onsi/gomega"
	. "github.com/onsi/gomega/gstruct"

	"jellarr/src/internal/config"
)

func TestLoadHappyPath(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	p := writeTmpYml(t, `
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true
  pluginRepositories:
    - name: "Repo"
      url: "https://repo"
      enabled: true
  trickplayOptions:
    enableHwAcceleration: true
`)
	// Act
	cfg, err := config.Load(p)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())

	g.Expect(*cfg).To(MatchFields(IgnoreExtras, Fields{
		"Version": Equal(1),
		"BaseUrl": Equal("http://localhost:8096"),
		"System": MatchAllFields(Fields{
			"EnableMetrics": PointTo(BeTrue()),
			"PluginRepositories": ConsistOf(
				MatchAllFields(Fields{
					"Name":    Equal("Repo"),
					"URL":     Equal("https://repo"),
					"Enabled": BeTrue(),
				}),
			),
			"TrickplayOptions": PointTo(MatchAllFields(Fields{
				"EnableHwAcceleration": BeTrue(),
			})),
		}),
	}))
}

func WhenNoEnableMetricsInConfigThenEnableMetricsInSystemSpecIsNil(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	p := writeTmpYml(t, `
version: 1
base_url: "http://localhost:8096"
system:
  pluginRepositories:
    - name: "Repo"
      url: "https://repo"
      enabled: true
  trickplayOptions:
    enableHwAcceleration: true
`)

	// Act
	cfg, err := config.Load(p)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())

	g.Expect(cfg.System.EnableMetrics).To(BeNil())
	g.Expect(cfg.System.PluginRepositories).NotTo(BeNil())
	g.Expect(cfg.System.TrickplayOptions).NotTo(BeNil())
}

func WhenNoPluginRepositoriesInConfigThenPluginRepositoriesInSystemSpecIsNil(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	p := writeTmpYml(t, `
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true
  trickplayOptions:
    enableHwAcceleration: true
`)

	// Act
	cfg, err := config.Load(p)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())

	g.Expect(cfg.System.EnableMetrics).NotTo(BeNil())
	g.Expect(cfg.System.PluginRepositories).To(BeNil())
	g.Expect(cfg.System.TrickplayOptions).NotTo(BeNil())
}

func WhenNoTrickplayOptionsInConfigThenTrickplayOptionsInSystemSpecIsNil(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	p := writeTmpYml(t, `
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true
  pluginRepositories:
    - name: "Repo"
      url: "https://repo"
      enabled: true
`)

	// Act
	cfg, err := config.Load(p)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())

	g.Expect(cfg.System.EnableMetrics).NotTo(BeNil())
	g.Expect(cfg.System.PluginRepositories).NotTo(BeNil())
	g.Expect(cfg.System.TrickplayOptions).To(BeNil())
}

func WhenBadYAMLThenLoadErrors(t *testing.T) {
	//Arrange
	g := NewWithT(t)

	p := writeTmpYml(t, "system: [1,2")

	// Act
	_, err := config.Load(p)

	// Assert
	g.Expect(err).To(HaveOccurred())
}

func writeTmpYml(t *testing.T, yml string) string {
	dir := t.TempDir()
	p := filepath.Join(dir, "cfg.yml")
	if err := os.WriteFile(p, []byte(yml), 0o644); err != nil {
		t.Fatalf("write: %v", err)
	}
	return p
}
