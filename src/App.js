import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function createStudent(student) {
  return axios.post('http://localhost:8000/students', student);
}

function updateStudent(studentId, student) {
  return axios.put(`http://localhost:8000/students/${studentId}`, student);
}

function deleteStudent(studentId) {
  return axios.delete(`http://localhost:8000/students/${studentId}`);
}


function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: 0 });

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState({ name: '', age: 0 });


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get('http://localhost:8000/students')
      .then(response => setStudents(response.data))
      .catch(error => console.log(error));
  };

  const handleCreateStudent = () => {
    createStudent(newStudent)
      .then(() => {
        setNewStudent({ name: '', age: 0 });
        fetchStudents();
      })
      .catch(error => console.log(error));
  };

  const handleEditStudent = student => {
    setEditingStudentId(student.id);
    setUpdatedStudent({ name: student.name, age: student.age });
  };
  
  const handleUpdateStudent = studentId => {
    if (editingStudentId === null) {
      // The user hasn't clicked the Edit button, so don't update
      return;
    }
  
    const student = students.find(student => student.id === studentId);
    if (student.name === updatedStudent.name && student.age === updatedStudent.age) {
      // No changes were made, so don't update
      setEditingStudentId(null);
      return;
    }
  
    updateStudent(studentId, updatedStudent)
      .then(() => {
        setEditingStudentId(null);
        fetchStudents();
      })
      .catch(error => console.log(error));
  }; 

  const handleDeleteStudent = studentId => {
    deleteStudent(studentId)
      .then(() => fetchStudents())
      .catch(error => console.log(error));
  };

  return (
    <div className="app-container">
      <h1>Student Management App</h1>
      <ul className="student-list">
        {students.map(student => (
          <li key={student.id}>
            {editingStudentId === student.id ? (
              <>
                <input
                  type="text"
                  value={updatedStudent.name}
                  onChange={e => setUpdatedStudent({ ...updatedStudent, name: e.target.value })}
                />
                <input
                  type="number"
                  value={updatedStudent.age}
                  onChange={e => setUpdatedStudent({ ...updatedStudent, age: parseInt(e.target.value) })}
                />
              </>
            ) : (
              <>
                {student.name} (Age: {student.age})
                <button onClick={() => handleEditStudent(student)}>Edit</button>
              </>
            )}
            <button onClick={() => handleUpdateStudent(student.id)}>Update</button>
            <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newStudent.name}
          onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="number"
          value={newStudent.age}
          onChange={e => setNewStudent({ ...newStudent, age: parseInt(e.target.value) })}
        />
        <button onClick={handleCreateStudent}>Add Student</button>
      </div>
    </div>
  );
  
}


export default App;
