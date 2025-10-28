package apply_test

import (
	"context"
	"testing"

	. "github.com/onsi/gomega"

	"jellarr/src/internal/apply"
	"jellarr/src/internal/model"
)

type mockJF struct {
	state       model.SystemState
	updatedSpec *model.SystemSpec
}

func (m *mockJF) GetSystem(ctx context.Context) (model.SystemState, error) { return m.state, nil }
func (m *mockJF) UpdateSystem(ctx context.Context, in model.SystemSpec) error {
	m.updatedSpec = &in
	return nil
}

func TestApplySystem_NoChange(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	m := &mockJF{
		state: model.SystemState{
			EnableMetrics: true,
			PluginRepositories: []model.PluginRepository{
				{Name: "A", URL: "u1", Enabled: true},
			},
		},
	}

	desired := model.SystemSpec{
		EnableMetrics: true,
		PluginRepositories: []model.PluginRepository{
			{Name: "A", URL: "u1", Enabled: true},
		},
	}

	// Act
	err := apply.ApplySystem(context.Background(), m, desired)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(m.updatedSpec).To(BeNil(), "should not update when desired == current")
}

func TestApplySystem_Change(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	m := &mockJF{
		state: model.SystemState{
			EnableMetrics: true,
			PluginRepositories: []model.PluginRepository{
				{Name: "A", URL: "u1", Enabled: true},
			},
		},
	}

	desired := model.SystemSpec{
		EnableMetrics: true,
		PluginRepositories: []model.PluginRepository{
			{Name: "A", URL: "u1", Enabled: true},
			{Name: "B", URL: "u2", Enabled: false},
		},
	}

	// Act
	err := apply.ApplySystem(context.Background(), m, desired)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(m.updatedSpec).NotTo(BeNil(), "expected update to be triggered")
	g.Expect(*m.updatedSpec).To(Equal(desired))
}

func TestEqualReposUnordered(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	a := []model.PluginRepository{
		{Name: "A", URL: "u1", Enabled: true},
		{Name: "B", URL: "u2", Enabled: false},
	}
	b := []model.PluginRepository{
		{Name: "B", URL: "u2", Enabled: false},
		{Name: "A", URL: "u1", Enabled: true},
	}
	c := []model.PluginRepository{
		{Name: "A", URL: "u1", Enabled: false},
	}

	// Act & Assert
	g.Expect(apply.EqualReposUnordered(a, b)).To(BeTrue(), "same sets should be equal regardless of order")
	g.Expect(apply.EqualReposUnordered(a, c)).To(BeFalse(), "different sets should not be equal")
}
