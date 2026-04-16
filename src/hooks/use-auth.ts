"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn as signInAction } from "@/actions";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePostSignIn = async () => {
    // Find the user's most recent project
    const projects = await getProjects();

    if (projects.length > 0) {
      router.push(`/${projects[0].id}`);
      return;
    }

    // If no projects exist, create a new one
    const newProject = await createProject({
      name: `New Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });

    router.push(`/${newProject.id}`);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInAction(email, password);

      if (result.success) {
        await handlePostSignIn();
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
}
