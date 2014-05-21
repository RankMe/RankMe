class PagesController < ApplicationController

	def home
		redirect_to projects_path
	end

end
