import { useEffect, useState } from "react"

import { Actor, HttpAgent } from "@dfinity/agent"
import { advance4 } from "../../declarations/advance4"

import useAuth from "./useAuth"
import { Principal } from "@dfinity/principal"

import useTextFileReader from "./useFileReader"
import { Proposal } from "../../declarations/advance4/advance4.did"

import './app.css';

function App() {
  const { authClient, authenticatedStatus, identity, principal, authLogin } = useAuth()

  const [foundation, setFoundation] = useState<Array<Principal>>([])
  const [proposals, setProposals] = useState<Array<Proposal>>([])

  async function getFoundation() {
    setFoundation(await advance4.getFoundation())
  }

  async function createCanister(e: any) {
    await advance4.testInstall([Principal.fromText('rkp4c-7iaaa-aaaaa-aaaca-cai')], [[...new Uint8Array(e.target?.result)]])
  }

  const handleFileReader = async (e: any) => {
    try {
      // 获取文件
      const file = e.target.files[0];
      // 实例化 FileReader对象
      const reader = new FileReader();
      reader.onload = function (e) {
        // 在onload函数中获取最后的内容
        // setFileContent(e.target.result as string);
        console.log(e.target?.result);
        createCanister(e)


      };
      // 调用readerAsText方法读取文本
      reader.readAsText(file);
    } catch (error) {
      console.log(error)
    }
  };

  async function getProposals() {
    setProposals(await advance4.getProposals())
    console.log(await advance4.getProposals());

  }

  useEffect(() => {
    getFoundation()
    getProposals()
    // createCanister()
    // console.log(authenticatedStatus);
    // console.log(principal);
    // console.log(identity);


  }, [])

  return (
    <>
      <input type="file" onChange={handleFileReader} />
      {
        authenticatedStatus ?
          <div className="wrap">
            <div className="content-wrap">
              <div className="main-tit">Hello,your principal is </div>
              <div>{principal}</div>
            </div>
            <div className="content-wrap">
              <div className="main-tit">Foundation members</div>
              {
                foundation.map(mem => {
                  return (
                    <div key={mem.toString()}>{mem.toString()}</div>
                  )
                })
              }
            </div>
            <div className="content-wrap">
              <div className="main-tit">Proposal List</div>
              <div className="proposal-group">
                {
                  proposals.map(proposal => {
                    return (
                      <div key={`proposals${proposal.proposalsID}`}>
                        <div className="row-group">
                          <div className="row-tit">ProposalID</div>
                          <div>{proposal.proposalsID.toString()}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">Proposer</div>
                          <div>{proposal.proposer.toText()}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">WasmCodeHash</div>
                          <div>{proposal.wasmCodeHash.toString()}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">OperationType</div>
                          <div>{Object.keys(proposal.operation)[0]}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">CanisterID</div>
                          <div>{proposal.canisterID.toString()}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">Approvers</div>
                          {proposal.approvers.map(approver => {
                            return (
                              <div>{approver.toString()}</div>
                            )
                          })}
                        </div>
                        <div className="row-group">
                          <div className="row-tit">Refusers</div>
                          {proposal.refusers.map(refuser => {
                            return (
                              <div>{refuser.toString()}</div>
                            )
                          })}
                        </div>
                        <div className="row-group">
                          <div className="row-tit">IsApprover</div>
                          <div>{proposal.isApprover ? 'true' : 'false'}</div>
                        </div>
                        <div className="row-group">
                          <div className="row-tit">Done</div>
                          <div>{proposal.done ? 'true' : 'false'}</div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div> :
          <button type="button" onClick={authLogin}>登录</button>
      }
    </>
  )
}

export default App