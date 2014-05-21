class KeywordsController < ApplicationController
	skip_before_filter :verify_authenticity_token, :only => :create

	def create
		
		# récupération du projet
		@project = Project.find(params[:project_id])

		# récupération du site
		@site = @project.sites.find(params[:site_id])

		# création du mot clef
		@keyWord = @site.key_words.create(params[:key_word].permit(:string))

		@keyWord.rank = -1
		@keyWord.save

		# redirection vers la page du site
		redirect_to "/projects/" + @project.id.to_s + "/sites/" + @site.id.to_s
	end

	def show

		# récupération du projet et du site en question
		@project = Project.find(params[:project_id])
		@site = @project.sites.find(params[:site_id])
		@keyWord = @site.key_words.find(params[:id])

	end

	def destroy
		@project = Project.find(params[:project_id])

		@site = @project.sites.find(params[:site_id])

		@keyWord = @site.key_words.find(params[:id])

		@keyWord.destroy

		redirect_to "/projects/" + @project.id.to_s + "/sites/" + @site.id.to_s
	end

end
