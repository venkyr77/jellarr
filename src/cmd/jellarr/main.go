package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"jellarr/src/internal/api"
	"jellarr/src/internal/apply"
	"jellarr/src/internal/config"
)

var (
	cfgPath  = "config/config.yml"
	applyAll = apply.ApplyAll
)

func getConfigFilePath() string {
	fs := flag.NewFlagSet("jellarr", flag.ContinueOnError)
	cfg := cfgPath
	fs.StringVar(&cfg, "configFile", cfgPath, "path to config file")
	fs.Parse(os.Args[1:])
	return cfg
}

func run() error {
	cfg, err := config.Load(getConfigFilePath())
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
