import {useState} from 'react'

export default function Comment({message}) {

    return (
        <>
            <div className="sm:items-start mt-2 mb-2">
                <div className="flex w-full flex-col items-center space-y-4 ">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}

                    <div
                        className="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="w-0 flex-1 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <img hidden={true}
                                        className="h-10 w-10 rounded-full"
                                        src=""
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">name</p>
                                    <p className="mt-1 text-sm text-gray-500">{message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
