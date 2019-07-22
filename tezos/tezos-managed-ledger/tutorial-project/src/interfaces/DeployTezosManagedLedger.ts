import { TezosNodeWriter, TezosParameterFormat, KeyStore } from 'conseiljs';
import { operationResult } from '../utilities/OperationInformation';

/**
 * Deploys an instance of the Tezos Managed Ledger smart contract.
 * 
 * @param tezosNode - The web address of the Tezos node through which the deploy operation is sent
 * @param keystore - The sender's account information
 */
export async function deployContract(tezosNode: string, keystore: KeyStore): Promise<operationResult> {
    const michelson = `
    parameter
   (or (pair address (pair address nat))
      (or (pair address nat)
         (or (pair
               (pair address address)
               (contract nat))
            (or (pair address (contract nat))
                  (or (pair unit (contract nat))
                     (or bool
                        (or address
                              (or (pair unit (contract address))
                                 (or (pair address nat)
                                    (pair address nat))))))))));
   storage
   (pair (map address (pair nat (map address nat))) (pair address (pair bool nat)));
   code { DUP ;
      CAR ;
      DIP { CDR } ;
      IF_LEFT
         { DIP { DUP ;
               CDR ;
               CDR ;
               CAR ;
               IF { PUSH (pair string unit) (Pair "OperationsArePaused" Unit) ; FAILWITH } {} } ;
         DUP ;
         CDR ;
         CAR ;
         DIP { DUP ; CAR } ;
         CAST address ;
         COMPARE ;
         EQ ;
         IF { DROP }
            { DUP ;
               CAR ;
               DIP { DIP { DUP } ; SWAP } ;
               SENDER ;
               COMPARE ;
               EQ ;
               IF { DROP ; PUSH bool False } { CDR ; CAR ; SENDER ; COMPARE ; NEQ } ;
               IF { DUP ;
                     DIP { DUP ;
                           DIP { DIP { DUP } ;
                                 CAR ;
                                 SENDER ;
                                 PAIR ;
                                 DUP ;
                                 DIP { CDR ;
                                       DIP { CAR } ;
                                       GET ;
                                       IF_NONE { EMPTY_MAP address nat } { CDR } } ;
                                 CAR ;
                                 GET ;
                                 IF_NONE { PUSH nat 0 } {} } ;
                           DUP ;
                           CAR ;
                           DIP { SENDER ;
                                 DIP { DUP ;
                                       CDR ;
                                       CDR ;
                                       DIP { DIP { DUP } ; SWAP } ;
                                       SWAP ;
                                       SUB ;
                                       ISNAT ;
                                       IF_NONE
                                       { DIP { DUP } ;
                                          SWAP ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          CDR ;
                                          CDR ;
                                          PAIR ;
                                          PUSH string "NotEnoughAllowance" ;
                                          PAIR ;
                                          FAILWITH }
                                       {} } ;
                                 PAIR } ;
                           PAIR ;
                           DIP { DROP ; DROP } ;
                           DIP { DUP ; CAR } ;
                           SWAP ;
                           DIP { DUP ; CAR } ;
                           SWAP ;
                           GET ;
                           IF_NONE
                           { PUSH nat 0 ;
                              DIP { EMPTY_MAP address nat } ;
                              PAIR ;
                              EMPTY_MAP address nat }
                           { DUP ; CDR } ;
                           DIP { DIP { DUP } ; SWAP } ;
                           SWAP ;
                           CDR ;
                           CDR ;
                           DUP ;
                           INT ;
                           EQ ;
                           IF { DROP ; NONE nat } { SOME } ;
                           DIP { DIP { DIP { DUP } ; SWAP } ; SWAP } ;
                           SWAP ;
                           CDR ;
                           CAR ;
                           UPDATE ;
                           DIP { DUP ; DIP { CAR } ; CDR } ;
                           DIP { DROP } ;
                           SWAP ;
                           PAIR ;
                           SOME ;
                           SWAP ;
                           CAR ;
                           DIP { DIP { DUP ; CAR } } ;
                           UPDATE ;
                           DIP { DUP ; DIP { CDR } ; CAR } ;
                           DIP { DROP } ;
                           PAIR } }
                  {} ;
               DIP { DUP } ;
               SWAP ;
               CAR ;
               DIP { DUP } ;
               SWAP ;
               CDR ;
               CAR ;
               GET ;
               IF_NONE
                  { DUP ;
                  CDR ;
                  CDR ;
                  INT ;
                  EQ ;
                  IF { NONE (pair nat (map address nat)) }
                     { DUP ; CDR ; CDR ; DIP { EMPTY_MAP address nat } ; PAIR ; SOME } }
                  { DIP { DUP } ;
                  SWAP ;
                  CDR ;
                  CDR ;
                  DIP { DUP ; CAR } ;
                  ADD ;
                  DIP { DUP ; DIP { CDR } ; CAR } ;
                  DIP { DROP } ;
                  PAIR ;
                  SOME } ;
               SWAP ;
               DIP { DIP { DUP ; CAR } } ;
               DUP ;
               DIP { CDR ;
                     CAR ;
                     UPDATE ;
                     DIP { DUP ; DIP { CDR } ; CAR } ;
                     DIP { DROP } ;
                     PAIR } ;
               DUP ;
               DIP { CDR ;
                     CDR ;
                     INT ;
                     DIP { DUP ; CDR ; DUP ; CDR ; CDR } ;
                     ADD ;
                     ISNAT ;
                     IF_NONE
                        { PUSH string
                              "Unexpected failure: Negative total supply" ;
                        FAILWITH }
                        {} ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DROP } ;
                     SWAP ;
                     PAIR ;
                     SWAP ;
                     PAIR ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DROP } ;
                     SWAP ;
                     PAIR } ;
               DIP { DUP } ;
               SWAP ;
               CAR ;
               DIP { DUP } ;
               SWAP ;
               CAR ;
               GET ;
               IF_NONE
                  { CDR ;
                  CDR ;
                  PUSH nat 0 ;
                  SWAP ;
                  PAIR ;
                  PUSH string "NotEnoughBalance" ;
                  PAIR ;
                  FAILWITH }
                  {} ;
               DUP ;
               CAR ;
               DIP { DIP { DUP } ; SWAP } ;
               SWAP ;
               CDR ;
               CDR ;
               SWAP ;
               SUB ;
               ISNAT ;
               IF_NONE
                  { CAR ;
                  DIP { DUP } ;
                  SWAP ;
                  CDR ;
                  CDR ;
                  PAIR ;
                  PUSH string "NotEnoughBalance" ;
                  PAIR ;
                  FAILWITH }
                  {} ;
               DIP { DUP ; DIP { CDR } ; CAR } ;
               DIP { DROP } ;
               PAIR ;
               DIP { DUP } ;
               SWAP ;
               DIP { DUP ;
                     CAR ;
                     INT ;
                     EQ ;
                     IF { DUP ;
                           CDR ;
                           SIZE ;
                           INT ;
                           EQ ;
                           IF { DROP ; NONE (pair nat (map address nat)) } { SOME } }
                        { SOME } ;
                     SWAP ;
                     CAR ;
                     DIP { DIP { DUP ; CAR } } ;
                     UPDATE ;
                     DIP { DUP ; DIP { CDR } ; CAR } ;
                     DIP { DROP } ;
                     PAIR } ;
               DUP ;
               DIP { CDR ;
                     CDR ;
                     NEG ;
                     DIP { DUP ; CDR ; DUP ; CDR ; CDR } ;
                     ADD ;
                     ISNAT ;
                     IF_NONE
                        { PUSH string
                              "Unexpected failure: Negative total supply" ;
                        FAILWITH }
                        {} ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DROP } ;
                     SWAP ;
                     PAIR ;
                     SWAP ;
                     PAIR ;
                     DIP { DUP ; DIP { CAR } ; CDR } ;
                     DIP { DROP } ;
                     SWAP ;
                     PAIR } ;
               DROP } ;
         NIL operation ;
         PAIR }
         { IF_LEFT
            { DIP { DUP ;
                     CDR ;
                     CDR ;
                     CAR ;
                     IF { PUSH (pair string unit) (Pair "OperationsArePaused" Unit) ; FAILWITH } {} } ;
               SENDER ;
               PAIR ;
               DIP { DUP } ;
               SWAP ;
               DIP { DUP } ;
               SWAP ;
               DUP ;
               DIP { CAR ;
                     DIP { CAR } ;
                     GET ;
                     IF_NONE { EMPTY_MAP address nat } { CDR } } ;
               CDR ;
               CAR ;
               GET ;
               IF_NONE { PUSH nat 0 } {} ;
               DUP ;
               INT ;
               EQ ;
               IF { DROP }
                  { DIP { DUP } ;
                  SWAP ;
                  CDR ;
                  CDR ;
                  INT ;
                  EQ ;
                  IF { DROP } { PUSH string "UnsafeAllowanceChange" ; PAIR ; FAILWITH } } ;
               DIP { DUP ; CAR } ;
               SWAP ;
               DIP { DUP ; CAR } ;
               SWAP ;
               GET ;
               IF_NONE
               { PUSH nat 0 ;
                  DIP { EMPTY_MAP address nat } ;
                  PAIR ;
                  EMPTY_MAP address nat }
               { DUP ; CDR } ;
               DIP { DIP { DUP } ; SWAP } ;
               SWAP ;
               CDR ;
               CDR ;
               DUP ;
               INT ;
               EQ ;
               IF { DROP ; NONE nat } { SOME } ;
               DIP { DIP { DIP { DUP } ; SWAP } ; SWAP } ;
               SWAP ;
               CDR ;
               CAR ;
               UPDATE ;
               DIP { DUP ; DIP { CAR } ; CDR } ;
               DIP { DROP } ;
               SWAP ;
               PAIR ;
               SOME ;
               SWAP ;
               CAR ;
               DIP { DIP { DUP ; CAR } } ;
               UPDATE ;
               DIP { DUP ; DIP { CDR } ; CAR } ;
               DIP { DROP } ;
               PAIR ;
               NIL operation ;
               PAIR }
            { IF_LEFT
               { DUP ;
                  CAR ;
                  DIP { CDR } ;
                  DIP { DIP { DUP } ; SWAP } ;
                  PAIR ;
                  DUP ;
                  CAR ;
                  DIP { CDR } ;
                  DUP ;
                  DIP { CAR ;
                        DIP { CAR } ;
                        GET ;
                        IF_NONE { EMPTY_MAP address nat } { CDR } } ;
                  CDR ;
                  GET ;
                  IF_NONE { PUSH nat 0 } {} ;
                  DIP { AMOUNT } ;
                  TRANSFER_TOKENS ;
                  NIL operation ;
                  SWAP ;
                  CONS ;
                  PAIR }
               { IF_LEFT
                     { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP } ; SWAP } ;
                     PAIR ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { CAR } ;
                     GET ;
                     IF_NONE { PUSH nat 0 } { CAR } ;
                     DIP { AMOUNT } ;
                     TRANSFER_TOKENS ;
                     NIL operation ;
                     SWAP ;
                     CONS ;
                     PAIR }
                     { IF_LEFT
                        { DUP ;
                           CAR ;
                           DIP { CDR } ;
                           DIP { DIP { DUP } ; SWAP } ;
                           PAIR ;
                           CDR ;
                           CDR ;
                           CDR ;
                           CDR ;
                           DIP { AMOUNT } ;
                           TRANSFER_TOKENS ;
                           NIL operation ;
                           SWAP ;
                           CONS ;
                           PAIR }
                        { IF_LEFT
                           { DIP { DUP ;
                                    CDR ;
                                    CAR ;
                                    SENDER ;
                                    COMPARE ;
                                    EQ ;
                                    IF {} { PUSH (pair string unit) (Pair "SenderIsNotAdmin" Unit) ; FAILWITH } } ;
                              DIP { DUP ; CDR } ;
                              DIP { DUP ; DIP { CAR } ; CDR } ;
                              DIP { DUP ; DIP { CDR } ; CAR } ;
                              DIP { DROP } ;
                              PAIR ;
                              SWAP ;
                              PAIR ;
                              DIP { DUP ; DIP { CAR } ; CDR } ;
                              DIP { DROP } ;
                              SWAP ;
                              PAIR ;
                              NIL operation ;
                              PAIR }
                           { IF_LEFT
                                 { DIP { DUP ;
                                       CDR ;
                                       CAR ;
                                       SENDER ;
                                       COMPARE ;
                                       EQ ;
                                       IF {} { PUSH (pair string unit) (Pair "SenderIsNotAdmin" Unit) ; FAILWITH } } ;
                                 DIP { DUP ; CDR } ;
                                 DIP { DUP ; DIP { CDR } ; CAR } ;
                                 DIP { DROP } ;
                                 PAIR ;
                                 DIP { DUP ; DIP { CAR } ; CDR } ;
                                 DIP { DROP } ;
                                 SWAP ;
                                 PAIR ;
                                 NIL operation ;
                                 PAIR }
                                 { IF_LEFT
                                    { DUP ;
                                       CAR ;
                                       DIP { CDR } ;
                                       DIP { DIP { DUP } ; SWAP } ;
                                       PAIR ;
                                       CDR ;
                                       CDR ;
                                       CAR ;
                                       DIP { AMOUNT } ;
                                       TRANSFER_TOKENS ;
                                       NIL operation ;
                                       SWAP ;
                                       CONS ;
                                       PAIR }
                                    { IF_LEFT
                                       { DIP { DUP ;
                                                CDR ;
                                                CAR ;
                                                SENDER ;
                                                COMPARE ;
                                                EQ ;
                                                IF {} { PUSH (pair string unit) (Pair "SenderIsNotAdmin" Unit) ; FAILWITH } } ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          CAR ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          CAR ;
                                          GET ;
                                          IF_NONE
                                             { DUP ;
                                             CDR ;
                                             INT ;
                                             EQ ;
                                             IF { NONE (pair nat (map address nat)) }
                                                { DUP ; CDR ; DIP { EMPTY_MAP address nat } ; PAIR ; SOME } }
                                             { DIP { DUP } ;
                                             SWAP ;
                                             CDR ;
                                             DIP { DUP ; CAR } ;
                                             ADD ;
                                             DIP { DUP ; DIP { CDR } ; CAR } ;
                                             DIP { DROP } ;
                                             PAIR ;
                                             SOME } ;
                                          SWAP ;
                                          DIP { DIP { DUP ; CAR } } ;
                                          DUP ;
                                          DIP { CAR ;
                                                UPDATE ;
                                                DIP { DUP ; DIP { CDR } ; CAR } ;
                                                DIP { DROP } ;
                                                PAIR } ;
                                          DUP ;
                                          DIP { CDR ;
                                                INT ;
                                                DIP { DUP ; CDR ; DUP ; CDR ; CDR } ;
                                                ADD ;
                                                ISNAT ;
                                                IF_NONE
                                                   { PUSH string
                                                         "Unexpected failure: Negative total supply" ;
                                                   FAILWITH }
                                                   {} ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DROP } ;
                                                SWAP ;
                                                PAIR ;
                                                SWAP ;
                                                PAIR ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DROP } ;
                                                SWAP ;
                                                PAIR } ;
                                          DROP ;
                                          NIL operation ;
                                          PAIR }
                                       { DIP { DUP ;
                                                CDR ;
                                                CAR ;
                                                SENDER ;
                                                COMPARE ;
                                                EQ ;
                                                IF {} { PUSH (pair string unit) (Pair "SenderIsNotAdmin" Unit) ; FAILWITH } } ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          CAR ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          CAR ;
                                          GET ;
                                          IF_NONE
                                             { CDR ;
                                             PUSH nat 0 ;
                                             SWAP ;
                                             PAIR ;
                                             PUSH string "NotEnoughBalance" ;
                                             PAIR ;
                                             FAILWITH }
                                             {} ;
                                          DUP ;
                                          CAR ;
                                          DIP { DIP { DUP } ; SWAP } ;
                                          SWAP ;
                                          CDR ;
                                          SWAP ;
                                          SUB ;
                                          ISNAT ;
                                          IF_NONE
                                             { CAR ;
                                             DIP { DUP } ;
                                             SWAP ;
                                             CDR ;
                                             PAIR ;
                                             PUSH string "NotEnoughBalance" ;
                                             PAIR ;
                                             FAILWITH }
                                             {} ;
                                          DIP { DUP ; DIP { CDR } ; CAR } ;
                                          DIP { DROP } ;
                                          PAIR ;
                                          DIP { DUP } ;
                                          SWAP ;
                                          DIP { DUP ;
                                                CAR ;
                                                INT ;
                                                EQ ;
                                                IF { DUP ;
                                                      CDR ;
                                                      SIZE ;
                                                      INT ;
                                                      EQ ;
                                                      IF { DROP ; NONE (pair nat (map address nat)) } { SOME } }
                                                   { SOME } ;
                                                SWAP ;
                                                CAR ;
                                                DIP { DIP { DUP ; CAR } } ;
                                                UPDATE ;
                                                DIP { DUP ; DIP { CDR } ; CAR } ;
                                                DIP { DROP } ;
                                                PAIR } ;
                                          DUP ;
                                          DIP { CDR ;
                                                NEG ;
                                                DIP { DUP ; CDR ; DUP ; CDR ; CDR } ;
                                                ADD ;
                                                ISNAT ;
                                                IF_NONE
                                                   { PUSH string
                                                         "Unexpected failure: Negative total supply" ;
                                                   FAILWITH }
                                                   {} ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DROP } ;
                                                SWAP ;
                                                PAIR ;
                                                SWAP ;
                                                PAIR ;
                                                DIP { DUP ; DIP { CAR } ; CDR } ;
                                                DIP { DROP } ;
                                                SWAP ;
                                                PAIR } ;
                                          DROP ;
                                          NIL operation ;
                                          PAIR } } } } } } } } } }
    `;
    const michelson_storage = 'Pair {} (Pair "tz1WpPzK6NwWVTJcXqFvYmoA6msQeVy1YP6z" (Pair False 0))';
    return await TezosNodeWriter.sendContractOriginationOperation(tezosNode, keystore, 0, undefined, false, true, 15000000, '', 5392, 144382, michelson, michelson_storage, TezosParameterFormat.Michelson);
}