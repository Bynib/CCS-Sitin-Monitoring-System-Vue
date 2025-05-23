import { defineStore } from "pinia";
import { reactive } from "vue";

export const useStudentStore = defineStore("student",() => {
    const user = reactive({
        type: 'none'
    })
    const student = reactive({
        idNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        course: '',
        yearLevel: '',
        email: '',
        username: '',
        password: '',
        sessions: '',
        isAdmin: '',
    })

    function setStudent(studentInfo: any) {
        student.idNo = studentInfo.idno;
        student.firstName = studentInfo.firstname;
        student.middleName = studentInfo.middlename;
        student.lastName = studentInfo.lastname;
        student.course = studentInfo.course;
        student.yearLevel = studentInfo.yearlevel;
        student.email = studentInfo.email;
        student.username = studentInfo.username;
        student.password = studentInfo.password;
        student.sessions = studentInfo.sessions;
        student.isAdmin = studentInfo.isAdmin;
    }

    function getStudent() {
        return student
    }
    function setUser(type: string) {
        user.type = type;
    }
    return { student, setStudent, getStudent, user };
    
},

{
    persist: true
}

);