package api_test

import (
	"context"
	"errors"
	"net/http"
	"testing"

	. "github.com/onsi/gomega"
	. "github.com/onsi/gomega/gstruct"

	jellyfin "github.com/sj14/jellyfin-go/api"

	"jellarr/src/internal/api"
	"jellarr/src/internal/model"
)

type mockClient struct {
	getCalled    bool
	updateCalled bool
	err          error
	cfg          *jellyfin.ServerConfiguration
}

func (m *mockClient) GetConfiguration(ctx context.Context) jellyfin.ApiGetConfigurationRequest {
	m.getCalled = true
	var r jellyfin.ApiGetConfigurationRequest
	return r
}

func (m *mockClient) GetConfigurationExecute(_ jellyfin.ApiGetConfigurationRequest) (*jellyfin.ServerConfiguration, *http.Response, error) {
	if m.err != nil {
		return nil, nil, m.err
	}
	if m.cfg == nil {
		m.cfg = &jellyfin.ServerConfiguration{}
	}
	return m.cfg, nil, nil
}

func (m *mockClient) UpdateConfiguration(ctx context.Context) jellyfin.ApiUpdateConfigurationRequest {
	m.updateCalled = true
	var r jellyfin.ApiUpdateConfigurationRequest
	return r
}

func (m *mockClient) UpdateConfigurationExecute(_ jellyfin.ApiUpdateConfigurationRequest) (*http.Response, error) {
	if m.err != nil {
		return nil, m.err
	}
	return nil, nil
}

func ptr[T any](v T) *T { return &v }

func TestGetSystem_Success(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	enable := true
	repos := []jellyfin.RepositoryInfo{
		{
			Name:    *jellyfin.NewNullableString(ptr("Repo")),
			Url:     *jellyfin.NewNullableString(ptr("https://repo")),
			Enabled: ptr(true),
		},
	}
	m := &mockClient{
		cfg: &jellyfin.ServerConfiguration{
			EnableMetrics:      &enable,
			PluginRepositories: repos,
		},
	}

	// Act
	cl := &api.Client{Conf: m}
	state, err := cl.GetSystem(context.Background())

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(m.getCalled).To(BeTrue(), "GetConfiguration should be called")
	g.Expect(state).To(
		MatchAllFields(Fields{
			"EnableMetrics": BeTrue(),
			"PluginRepositories": ConsistOf(
				MatchAllFields(Fields{
					"Name":    Equal("Repo"),
					"URL":     Equal("https://repo"),
					"Enabled": BeTrue(),
				}),
			),
		}),
	)
}

func TestGetSystem_ErrorBubbles(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	m := &mockClient{err: errors.New("boom")}

	// Act
	cl := &api.Client{Conf: m}
	_, err := cl.GetSystem(context.Background())

	// Assert
	g.Expect(err).To(HaveOccurred())
	g.Expect(err.Error()).To(ContainSubstring("boom"))
	g.Expect(m.getCalled).To(BeTrue())
}

func TestUpdateSystem_Success(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	m := &mockClient{}
	spec := model.SystemSpec{
		EnableMetrics: true,
		PluginRepositories: []model.PluginRepository{
			{Name: "A", URL: "https://repo", Enabled: true},
		},
	}

	// Act
	cl := &api.Client{Conf: m}
	err := cl.UpdateSystem(context.Background(), spec)

	// Assert
	g.Expect(err).NotTo(HaveOccurred())
	g.Expect(m.updateCalled).To(BeTrue())
}

func TestUpdateSystem_ErrorBubbles(t *testing.T) {
	// Arrange
	g := NewWithT(t)
	m := &mockClient{err: errors.New("fail")}
	spec := model.SystemSpec{
		EnableMetrics: true,
		PluginRepositories: []model.PluginRepository{
			{Name: "A", URL: "https://repo", Enabled: true},
		},
	}

	// Act
	cl := &api.Client{Conf: m}

	// Assert
	err := cl.UpdateSystem(context.Background(), spec)
	g.Expect(err).To(HaveOccurred())
	g.Expect(err.Error()).To(ContainSubstring("fail"))
	g.Expect(m.updateCalled).To(BeTrue())
}
