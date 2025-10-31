package mapper_test

import (
	"testing"

	. "github.com/onsi/gomega"
	. "github.com/onsi/gomega/gstruct"

	jellyfin "github.com/sj14/jellyfin-go/api"

	"jellarr/src/internal/mapper"
	"jellarr/src/internal/model"
)

func TestRepoRoundTripHappyPath(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	in := []model.PluginRepository{
		{Name: "A", URL: "u1", Enabled: true},
		{Name: "B", URL: "u2", Enabled: false},
	}

	// Act
	jf := mapper.ToJFRepos(in)
	back := mapper.FromJFRepos(jf)

	// Assert
	g.Expect(back).To(Equal(in))
}

func TestRepoRoundTripWithEmptyValues(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	in := []model.PluginRepository{}

	// Act
	jf := mapper.ToJFRepos(in)
	back := mapper.FromJFRepos(jf)

	// Assert
	g.Expect(back).To(Equal(in))
}

func TestFromJFReposHandlesNull(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	jf := []jellyfin.RepositoryInfo{
		{},
	}

	// Act
	back := mapper.FromJFRepos(jf)

	// Assert
	g.Expect(back).To(Equal([]model.PluginRepository{
		{Name: "", URL: "", Enabled: false},
	}))
}

func TestToJFReposHandlesEmptyValues(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	in := []model.PluginRepository{
		{Name: "", URL: "", Enabled: false},
	}

	// Act
	out := mapper.ToJFRepos(in)

	// Assert
	g.Expect(out).To(HaveLen(1))

	g.Expect(out[0]).To(MatchAllFields(Fields{
		"Name": WithTransform(func(n jellyfin.NullableString) string {
			if v := n.Get(); v != nil {
				return *v
			}
			return ""
		}, Equal("")),

		"Url": WithTransform(func(u jellyfin.NullableString) string {
			if v := u.Get(); v != nil {
				return *v
			}
			return ""
		}, Equal("")),

		"Enabled": PointTo(BeFalse()),
	}))
}

func TestTrickplayOptionsRoundTripHappyPath(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	in := model.TrickplayOptions{
		EnableHwAcceleration: true,
	}

	// Act
	jf := mapper.ToJFTrickplayOptions(in)
	back := mapper.FromJFTrickplayOptions(*jf)

	// Assert
	g.Expect(back).To(Equal(in))
}

func TestTrickplayOptionsRoundTripWithEmptyValues(t *testing.T) {
	// Arrange
	g := NewWithT(t)

	in := model.TrickplayOptions{}

	// Act
	jf := mapper.ToJFTrickplayOptions(in)
	back := mapper.FromJFTrickplayOptions(*jf)

	// Assert
	g.Expect(back).To(Equal(in))
}
