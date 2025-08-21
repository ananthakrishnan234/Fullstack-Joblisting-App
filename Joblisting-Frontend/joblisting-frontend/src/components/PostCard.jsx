export default function PostCard({ post }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-primary">{post.profile}</h5>
          <p className="card-text">{post.desc}</p>
          <p className="card-text"><strong>Experience:</strong> {post.exp} years</p>
          <div>
            <strong>Technologies:</strong>
            <div className="mt-2 d-flex flex-wrap gap-1">
              {post.techs.map((tech, i) => (
                <span key={i} className="badge bg-info text-dark">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
