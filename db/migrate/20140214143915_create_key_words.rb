class CreateKeyWords < ActiveRecord::Migration
  def change
    create_table :key_words do |t|
      t.string :string

      t.timestamps
    end
  end
end
