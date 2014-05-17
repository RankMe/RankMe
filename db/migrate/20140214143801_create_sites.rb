class CreateSites < ActiveRecord::Migration
  def change
    create_table :sites do |t|
      t.string :url
      t.integer :rank

      t.references :project, index: true

      t.timestamps
    end
  end
end
