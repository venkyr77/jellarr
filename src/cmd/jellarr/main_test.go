package main

import (
	"context"
	"os"
	"testing"

	. "github.com/onsi/gomega"

	"jellarr/src/internal/api"
	"jellarr/src/internal/config"
)

func withArgs(args []string, fn func()) {
	orig := os.Args
	defer func() { os.Args = orig }()
	os.Args = args
	fn()
}

func TestGetConfigWithDefaultFilePath(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	// Act
	withArgs([]string{"jellarr"}, func() {
		path := getConfigFilePath()

		// Assert
		g.Expect(path).To(Equal(cfgPath)) // default is "config/config.yml"
	})
}

func TestGetConfigWithOverridenFilePath(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	override := "/tmp/test.yml"

	// Act
	withArgs([]string{"jellarr", "--configFile", override}, func() {
		path := getConfigFilePath()

		// Assert
		g.Expect(path).To(Equal(override))
	})
}

func TestRunWithNoApiKey(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	_ = os.Unsetenv("JELLARR_API_KEY")
	sample := "../../../sample-config.yml"

	var err error

	// Act
	withArgs([]string{"jellarr", "--configFile", sample}, func() {
		err = run()
	})

	// Assert
	g.Expect(err).To(HaveOccurred())
	g.Expect(err.Error()).To(ContainSubstring("JELLARR_API_KEY"))
}

func TestRunHappyPath(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	os.Setenv("JELLARR_API_KEY", "dummy")
	defer os.Unsetenv("JELLARR_API_KEY")

	called := false
	orig_applyAll := applyAll
	defer func() { applyAll = orig_applyAll }()

	applyAll = func(_ context.Context, _ api.JF, _ *config.Config) error {
		called = true
		return nil
	}

	sample := "../../../sample-config.yml"
	var err error

	// Act
	withArgs([]string{"jellarr", "--configFile", sample}, func() {
		err = run()
	})

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(called).To(BeTrue(), "run should invoke applyAll when everything is configured correctly")
}
