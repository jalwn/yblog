package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		settings := app.Settings()

		// for all available settings fields you could check
		// https://github.com/pocketbase/pocketbase/blob/develop/core/settings_model.go#L121-L130
		settings.Meta.AppName = "yblog"
		//settings.Meta.AppURL = "https://example.com"
		settings.Logs.MaxDays = 90
		settings.Logs.LogAuthId = true
		settings.Logs.LogIP = false

		return app.Save(settings)
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
