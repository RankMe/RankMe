class SiteSerializer < ActiveModel::Serializer
	has_many :key_words
  	attributes :id, :url, :project_id
end
