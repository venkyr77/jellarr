package main

import (
	"context"
	"os"
	"testing"

	. "github.com/onsi/gomega"

	"jellarr/src/internal/api"
	"jellarr/src/internal/config"
)

func TestRun_NoApiKey(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	_ = os.Unsetenv("JELLARR_API_KEY")

	orig_cfgPath := cfgPath

	defer func() {
		cfgPath = orig_cfgPath
	}()

	cfgPath = "../../../sample-config.yml"

	// Act
	err := run()

	// Assert
	g.Expect(err).To(HaveOccurred())
	g.Expect(err.Error()).To(ContainSubstring("JELLARR_API_KEY"))
}

func TestMain_HappyPath(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	os.Setenv("JELLARR_API_KEY", "dummy")
	defer os.Unsetenv("JELLARR_API_KEY")

	called := false

	orig_applyAll := applyAll
	orig_cfgPath := cfgPath

	defer func() {
		applyAll = orig_applyAll
		cfgPath = orig_cfgPath
	}()

	applyAll = func(_ context.Context, _ api.JF, _ *config.Config) error {
		called = true
		return nil
	}

	cfgPath = "../../../sample-config.yml"

	// Act
	run()

	// Assert
	g.Expect(called).To(BeTrue(), "main should invoke applyAll")
}
