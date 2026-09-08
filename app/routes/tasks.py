from datetime import datetime
from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Task

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.route("/")
@login_required
def index():
    """Renderiza a página principal com a lista de tarefas."""
    return render_template("index.html", user=current_user)


@tasks_bp.route("/api/tasks", methods=["GET"])
@login_required
def list_tasks():
    """Retorna as tarefas do usuário logado, mais recentes primeiro."""
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks])


@tasks_bp.route("/api/tasks", methods=["POST"])
@login_required
def create_task():
    """Cria uma nova tarefa para o usuário logado."""
    data = request.get_json()
    title = (data.get("title") or "").strip()

    if not title:
        return jsonify({"error": "O título é obrigatório."}), 400

    due_date = None
    if data.get("due_date"):
        due_date = datetime.strptime(data["due_date"], "%Y-%m-%d").date()

    task = Task(
        title=title,
        description=data.get("description", ""),
        due_date=due_date,
        priority=data.get("priority", "media"),
        user_id=current_user.id,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PUT"])
@login_required
def update_task(task_id):
    """Atualiza campos de uma tarefa existente do usuário logado."""
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
    data = request.get_json()

    if "title" in data:
        task.title = data["title"].strip()
    if "description" in data:
        task.description = data["description"]
    if "priority" in data:
        task.priority = data["priority"]
    if "status" in data:
        task.status = data["status"]
    if "due_date" in data:
        task.due_date = datetime.strptime(data["due_date"], "%Y-%m-%d").date() if data["due_date"] else None

    db.session.commit()
    return jsonify(task.to_dict())


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id):
    """Remove uma tarefa do usuário logado."""
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({"success": True})