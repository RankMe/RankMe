class Site < ActiveRecord::Base
	belongs_to :project
	has_many :key_words
end
