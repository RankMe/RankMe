class SitesController < ApplicationController


	def show

		# récupération du projet et du site en question
		@project = Project.find(params[:project_id])
		@site = Site.find(params[:id])

	end

	def destroy

		# récupération du project en fonction de l'id envoyé en paramètre
		@project = Project.find(params[:project_id])

		# récupération du site parmis ceux du projet en fonction de son id
		@site = @project.sites.find(params[:id])

		# suppression du site
		@site.destroy

		# redirection vers la page d'affichage du project
		redirect_to project_path(@project)
	end

	def create

		# récupération du projet
		@project = Project.find(params[:project_id])

		# création du site, en autorisant uniquement le passage de l'url en paramètre
		@site = @project.sites.create(params[:site].permit(:url))

		# valeur par défaut du rang lorsqu'il n'a encore jamais été consulté
		@site.rank = -1

		# sauvegarde de la modification précédente
		@site.save

		# redirection vers la page du projet
		redirect_to project_path(@project)
	end

end
