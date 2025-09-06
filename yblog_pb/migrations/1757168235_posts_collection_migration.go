package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// init a new auth collection with the default system fields and auth options
		collection := core.NewAuthCollection("clients")

		// restrict the list and view rules for record owners
		collection.ListRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")

		// add extra fields in addition to the default ones
		collection.Fields.Add(
			&core.TextField{
				Name:     "company",
				Required: true,
				Max:      100,
			},
			&core.URLField{
				Name:        "website",
				Presentable: true,
			},
		)

		// disable password auth and enable OTP only
		collection.PasswordAuth.Enabled = false
		collection.OTP.Enabled = true

		collection.AddIndex("idx_clients_company", false, "company", "")

		return app.Save(collection)

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
