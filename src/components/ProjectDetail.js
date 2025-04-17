function ProjectDetail({ project }) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <p>{project.description}</p>
        <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
  
        <h3 className="mt-6 font-semibold">Users</h3>
        <ul>
          {project.userDetails.map(user => (
            <li key={user.id}>
              {user.name} ({user.role}) - {user.email}
            </li>
          ))}
        </ul>
  
        <h3 className="mt-6 font-semibold">Tasks</h3>
        {project.tasks.length ? (
          <ul>
            {project.tasks.map(task => (
              <li key={task.id}>{task.title} - {task.status}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks yet.</p>
        )}
  
        <SearchUsers />
      </div>
    );
  }
  