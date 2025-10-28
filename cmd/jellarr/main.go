package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"jellarr/internal/api"
	"jellarr/internal/apply"
	"jellarr/internal/config"
)

func main() {
	cfgPath := "/config/jellarr.yml"
	if len(os.Args) > 1 {
		cfgPath = os.Args[1]
	}

	cfg, err := config.Load(cfgPath)
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	base := os.Getenv("JELLARR_BASE_URL")
	key := os.Getenv("JELLARR_API_KEY")
	if base == "" || key == "" {
		log.Fatal("set JELLARR_BASE_URL and JELLARR_API_KEY")
	}

	jf := api.New(base, key)
	if err := apply.ApplyAll(context.Background(), jf, cfg); err != nil {
		log.Fatalf("apply failed: %v", err)
	}
	fmt.Println("✅ jellarr apply complete")
}
