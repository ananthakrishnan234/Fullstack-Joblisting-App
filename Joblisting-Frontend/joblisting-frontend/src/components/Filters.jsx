export default function Filters({ onFilter }) {
  return (
    <div className="d-flex gap-2 mb-3">
      <select className="form-select" onChange={(e) => onFilter('exp', e.target.value)}>
        <option value="">Filter by Exp</option>
        <option value="5">5+</option>
        <option value="10">10+</option>
        <option value="15">15+</option>
      </select>
      <select className="form-select" onChange={(e) => onFilter('tech', e.target.value)}>
        <option value="">Filter by Tech</option>
        <option value="java">Java</option>
        <option value="springboot">Spring Boot</option>
        <option value="python">Python</option>
        <option value="aws">AWS</option>
      </select>
    </div>
  );
}
