class CreateKeyWords < ActiveRecord::Migration
  def change
    create_table :key_words do |t|
      t.string :string
      t.integer :rank

      t.references :site, index: true

      t.timestamps
    end
  end
end
