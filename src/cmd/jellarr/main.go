package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"jellarr/src/internal/api"
	"jellarr/src/internal/apply"
	"jellarr/src/internal/config"
)

var applyAll = apply.ApplyAll

var cfgPath = "config/config.yml"

func run() error {
	cfg, err := config.Load(cfgPath)
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	key := os.Getenv("JELLARR_API_KEY")
	if key == "" {
		return fmt.Errorf("set JELLARR_API_KEY")
	}

	jf := api.New(cfg.BaseUrl, key)
	return applyAll(context.Background(), jf, cfg)
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("✅ jellarr apply complete")
}
