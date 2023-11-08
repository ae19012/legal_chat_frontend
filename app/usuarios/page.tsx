"use client"

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";
import customAxios from "@/utils/customAxios";
import Pagination from "@/components/Pagination";

interface IUser {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol:  string;
}

interface IResponse {
  message: string;
  data: {
    totalPages: number,
    total: number,
    usuarios: IUser[]
  }
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<number>()

  useEffect(() => {
    customAxios.get<IResponse>(`/usuario?page=${currentPage}${filter == undefined ? '' : `&activo=${filter}`}`)
      .then((response) => {
        setUsers(response.data.data.usuarios);
        setTotalPages(response.data.data.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [currentPage, filter]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(Number(e.currentTarget.value));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="w-full flex flex-row justify-between mb-2">
        <select value={filter} onChange={handleFilter}>
          <option>Todos</option>
          <option value={1}>Activos</option>
          <option value={0}>Inactivos</option>
        </select>
        <button className=" boton-guardar">
          Nuevo usuario
        </button>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.nombre}</td>
              <td className="border px-4 py-2">{user.apellido}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.rol}</td>
              <td className="border px-4 py-2">
                <div className="flex flex-row justify-center gap-2">
                  <button className="boton-editar">Editar</button>
                  <button className="boton-error">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {}
      <div className="mt-4 flex flex-row justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onClick={paginate}/>
      </div>
    </div>
  );
};

export default UserTable;

