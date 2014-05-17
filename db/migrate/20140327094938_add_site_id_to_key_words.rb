class AddSiteIdToKeyWords < ActiveRecord::Migration
  def change
    add_column :key_words, :site_id, :integer
  end
end
