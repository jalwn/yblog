package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"

	"github.com/joho/godotenv"
)

var su = os.Getenv("SUPERUSER_EMAIL")
var su_pass = os.Getenv("SUPERUSER_PASSWORD")

func init() {
	m.Register(func(app core.App) error {
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		err = godotenv.Load()
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)
		su = os.Getenv("SUPER_USER")
		su_pass = os.Getenv("SUPER_USER_PASS")
		// note: the values can be eventually loaded via os.Getenv(key)
		// or from a special local config file
		record.Set("email", su)
		record.Set("password", su_pass)

		return app.Save(record)

	}, func(app core.App) error {
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, su)
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
