"use client"
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import usePlatformAPI from '@/fetchAPI/usePlatformAPI';

const GitHubCommits = ({ username }: any) => {
    const { getGitHubCommits } = usePlatformAPI()

    const [gitHubCommits, setGitHubCommits] = useState<any>()

    const handleGetCommits = async () => {
        if (!username) return
        if (gitHubCommits) return
        
        const commits = await getGitHubCommits(String(username), false)
        setGitHubCommits(commits)
    }

    const allEdges = gitHubCommits?.map((repo: any) => {
        const repoName = repo.name;
        const edges = repo.refs.nodes?.[0]?.target?.history?.edges || [];
        return {
            repositoryName: repoName,
            commits: edges.map((edge: any) => edge.node),
        };
    });


    return (
        <div className={`border-[1px] border-neutral-900 p-2 px-4 rounded-[8px]`}>
            <Accordion type="single" collapsible>
                <AccordionItem value="all-commits" className="border-none">
                    <AccordionTrigger onClick={() => handleGetCommits()}>
                        <div className="flex gap-[2rem]">
                            All Commits
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-[2rem]">
                        {allEdges?.map((repo: any, repoIndex: number) => (
                            <Accordion key={repoIndex} type="single" collapsible>
                                <AccordionItem value={`repo-${repoIndex}`} className="border-none">
                                    <AccordionTrigger>
                                        <div className="flex gap-[2rem]">
                                            {repo.repositoryName}
                                        </div>
                                    </AccordionTrigger>
                                    {repo.commits.length === 0 ? (
                                        <AccordionContent className="py-2">
                                            <div>No commits available in this repository.</div>
                                        </AccordionContent>
                                    ) : (
                                        <>
                                            {repo.commits.some((commit: any) => commit.author?.user?.login === username) ? (
                                                repo.commits.map((commit: any, commitIndex: number) => (
                                                    <AccordionContent className="" key={commitIndex}>
                                                        {commit.author?.user?.login === username ? (
                                                            <div className="flex gap-2 border-b py-2 text-neutral-400">
                                                                <span className="font-semibold">Message:</span> {commit.message}
                                                            </div>
                                                        ) : null}
                                                    </AccordionContent>
                                                ))
                                            ) : (
                                                <AccordionContent className="py-2 text-neutral-400">
                                                    <div>No commits by {username}.</div>
                                                </AccordionContent>
                                            )}
                                        </>
                                    )}

                                </AccordionItem>
                            </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default GitHubCommits;
