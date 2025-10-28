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
	cfgPath := "config/config.yml"

	if len(os.Args) > 1 {
		cfgPath = os.Args[1]
	}

	cfg, err := config.Load(cfgPath)
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	key := os.Getenv("JELLARR_API_KEY")
	if key == "" {
		log.Fatal("set JELLARR_API_KEY")
	}

	jf := api.New(cfg.BaseUrl, key)
	if err := apply.ApplyAll(context.Background(), jf, cfg); err != nil {
		log.Fatalf("apply failed: %v", err)
	}

	fmt.Println("✅ jellarr apply complete")
}
