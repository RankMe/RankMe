class ProjectSerializer < ActiveModel::Serializer
	has_many :sites
  	attributes :id, :name, :user_id
end
