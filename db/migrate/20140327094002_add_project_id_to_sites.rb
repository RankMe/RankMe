class AddProjectIdToSites < ActiveRecord::Migration
  def change
    add_column :sites, :project_id, :integer
  end
end
