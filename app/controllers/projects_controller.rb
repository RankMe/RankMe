class ProjectsController < ApplicationController

	def index
		# récupération de tous les projets
		@projects = Project.all
	end

	def new
	end

	def destroy

		# récupération du project concerné
		@project = Project.find(params[:id])

		@project.destroy

		redirect_to projects_path
	end

	def edit

		# récupération du project pour afficher ses valeurs dans les champs de saisie
		@project = Project.find(params[:id])
	end

	def update

		# récupération du project concerné
		@project = Project.find(params[:id])

		# tentative de modification, puis redirection
		if @project.update(project_params)
			redirect_to @project
		else
			render 'edit'
		end
	end

	def create

		# création du projet en récupérant les paramètres grâce à la méthode "project_params"
		@project = Project.new(project_params)

		# sauvegarde du projet, si elle réussi on se redirige dessus, sinon retour au formulaire
		if @project.save
			redirect_to @project
		else
			render 'new'
		end
	end

	def show
		# recherche du projet en fonction de son id
		@project = Project.find(params[:id])
	end


	# méthode permettant de récupérer les paramètres utiles pour la création d'un projet
	private
	def project_params
		params.require(:project).permit(:name)
	end

end
